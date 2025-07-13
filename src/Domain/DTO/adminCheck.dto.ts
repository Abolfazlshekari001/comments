import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class AdminCheckDto {
    @ApiProperty({ example: 'true' })
    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    status: boolean;

  @ApiProperty({ example: 'javad' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  system_name: string;


  @ApiProperty({ example: 'aa111aa' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  system_password: string;

  @ApiProperty({ example: 'khabar' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  section: string;
}
export class AdminDtoResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  @IsString()
  result: string;
  @ApiProperty()
  @IsString()
  message: string;
}
