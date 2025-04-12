import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as argon from 'argon2';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private readonly config:ConfigService
  ) {}


  async register(registerDto: RegisterDto): Promise<any> {
    
    try {
            const hashedPassword = await argon.hash(registerDto.password);
            
            const user = await this.usersService.create({
              ...registerDto,
              password: hashedPassword,
              dateRegistered:Date()
            });
        
           const access_token = await this.signToken(user.id, user.email,'45m');
        
    
        
            return { message: "successful Registration",access_token };
          } catch (error) {
            if (error.code === '23505') {
              throw new ForbiddenException('Credentials taken');
            }
            return { error: 'Internal server error', msg: error.message };
          }
    
  }



  async login(loginDto: LoginDto) {
    
    try {
      const user = await this.usersService.findOneByEmail(loginDto.email);
      if (!user) throw new ForbiddenException('Credentials incorrect');
    
        const pwMatches = await argon.verify(user.password, loginDto.password);
        if (!pwMatches) throw new ForbiddenException('Credentials incorrect');
  
        const access_token = await this.signToken(user.id, user.email,'45m');
    
        return { message: "successful Login",access_token };
      } catch (err) {
        console.error('Error during login process:', err);
        return { error: 'Internal server error', msg: err.message };
      }
  }

  async signToken(userId: number, email: string, expiration: string): Promise<string> {
    const payload = { sub: userId, email };
    const secret = this.config.get('JWT_SECRET');
  
    return this.jwtService.signAsync(payload, {
      expiresIn: expiration,
      secret,
    });
  }
}