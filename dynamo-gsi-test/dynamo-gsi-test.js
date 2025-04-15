import { DynamoDBClient, ScanCommand, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

// --- Configuration ---
const client = new DynamoDBClient({
    region: "localhost",
    endpoint: "http://localhost:8000",
    credentials: {
        accessKeyId: "fakeMyKeyId",
        secretAccessKey: "fakeSecretAccessKey",
    },
});

async function getTopBorrowedBooks() {
    // Calculate date 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const isoDate = sixMonthsAgo.toISOString().split('T')[0];
    
    console.log(`Fetching loans since ${isoDate}`);
    
    try {
        // Step 1: Scan all BookLoan items from the last 6 months
        const scanParams = {
            TableName: 'LibraryManagement',
            FilterExpression: 'begins_with(PK, :book_prefix) AND begins_with(SK, :loan_prefix) AND loan_date >= :date',
            ExpressionAttributeValues: {
                ':book_prefix': { S: 'BOOK#' },
                ':loan_prefix': { S: 'LOAN#' },
                ':date': { S: isoDate }
            }
        };
        
        console.log('Scanning for book loans...');
        const scanResult = await client.send(new ScanCommand(scanParams));
        console.log(`Found ${scanResult.Items.length} loans in the period`);
        
        // Step 2: Count loans per book
        const bookCounts = {};
        scanResult.Items.forEach(item => {
            const unmarshalled = unmarshall(item);
            const bookId = unmarshalled.PK.split('#')[1];
            bookCounts[bookId] = (bookCounts[bookId] || 0) + 1;
        });
        
        console.log(`Found ${Object.keys(bookCounts).length} unique books borrowed`);
        
        // Step 3: Sort by count and get top 5
        const topBookIds = Object.entries(bookCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([bookId]) => bookId);
        
        if (topBookIds.length === 0) {
            console.log('No books found in the specified period');
            return [];
        }
        
        console.log('Top 5 book IDs:', topBookIds);
        
        // Step 4: Fetch details for the top 5 books
        const batchGetParams = {
            RequestItems: {
                'LibraryManagement': {
                    Keys: topBookIds.map(bookId => ({
                        PK: { S: `BOOK#${bookId}` },
                        SK: { S: `BOOK#${bookId}` }
                    }))
                }
            }
        };
        
        console.log('Fetching book details...');
        const batchResult = await client.send(new BatchGetItemCommand(batchGetParams));
        
        // Combine book details with their borrow counts
        const result = batchResult.Responses['LibraryManagement'].map(item => {
            const book = unmarshall(item);
            return {
                bookId: book.PK.split('#')[1],
                title: book.title,
                author: book.author,
                borrowCount: bookCounts[book.PK.split('#')[1]]
            };
        });
        
        console.log('Query completed successfully');
        return result;
        
    } catch (error) {
        console.error('Error in getTopBorrowedBooks:', error);
        throw error;
    }
}

// Execute the function
(async () => {
    try {
        const topBooks = await getTopBorrowedBooks();
        console.log('\nTop 5 most borrowed books:');
        console.table(topBooks);
    } catch (error) {
        console.error('Script failed:', error);
    }
})();