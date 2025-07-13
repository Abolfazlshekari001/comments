import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsBoolean, IsNotEmpty, IsString, MinLength, MaxLength } from "class-validator";

export class AddSystemDto {
    @ApiProperty({ example: 'true' })
    @IsOptional()
    @IsBoolean()
    @IsNotEmpty()
    hasRatingOption: boolean;
  
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
  
  }
  export class AddSystemResponseDto {
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    @IsString()
    result: string;
    @ApiProperty()
    @IsString()
    message: string;
  }
  