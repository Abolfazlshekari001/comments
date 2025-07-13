import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
  IsUrl,
  IsEmail,
  Matches,
  IsBoolean,
  IsInt,
  Min,
  Max,
} from 'class-validator';

export class CommentDto {
  @ApiProperty({ example: 'test' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 'test mikonam ' })
  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  @Matches(
    /$^|^(?=.*[a-zA-Zٸئڰێۏيكؤءؿآأاؾإبةؽپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیٱى‌])([A-Za-z٠-٩0-9۰-۹ ٸئڰێۏيكؤءؿآأاؾإبةؽپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیٱى‌_«»،؛@–\-./()\n\s])*$/,
  )
  comment_text: string;

  @ApiProperty({ example: 'javad' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  system_name: string;

  
  @ApiProperty({ example: 'aa111aa' })
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  system_password: string;
  
  @ApiProperty({ example: 'khabar' })
  @ApiProperty()
  @IsString()
  @IsOptional()
  @MinLength(4)
  @MaxLength(100)
  section: string;

  @ApiProperty({ example: '5' })
  @IsOptional()
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;


  @ApiProperty({ example: 's3d5d1c0-69cd-4507-ab96-dbdc0b8a89v4' })
  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  userId: string;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  like: boolean;

  @ApiProperty({ example: 'true' })
  @IsOptional()
  @IsBoolean()
  @IsNotEmpty()
  dislike: boolean;
}

export class CommentDtoResponseDto {
  @ApiProperty()
  success: boolean;
  @ApiProperty()
  @IsString()
  result
  @ApiProperty()
  @IsString()
  message: string;
}
