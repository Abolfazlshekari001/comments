import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional, IsString, IsNotEmpty, MinLength, MaxLength, Matches, IsInt, Min, Max, IsBoolean, IsUUID, IsNumber, ArrayMinSize, IsArray, ValidateNested } from "class-validator";

export class AddCommentSubmitDto {
  @ApiProperty({ example: 'test' })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(100)
  name: string;

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
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  section: string;


  @ApiProperty({ example: 's3d5d1c0-69cd-4507-ab96-dbdc0b8a89v4' })
  @IsOptional()
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  userId: string;


  @ApiProperty()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CommentDto)
  comments: CommentDto[];
}
export class CommentDto {
  @ApiProperty({ example: 'test mikonam ' })
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(100)
  @Matches(
    /$^|^(?=.*[a-zA-Zٸئڰێۏيكؤءؿآأاؾإبةؽپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیٱى‌])([A-Za-z٠-٩0-9۰-۹ ٸئڰێۏيكؤءؿآأاؾإبةؽپتثجچحخدذرزژسشصضطظعغفقکگلمنوهیٱى‌_«»،؛@–\-./()\n\s])*$/,
  )
  comment_text: string;

  @ApiProperty({ example: '5' })
  @IsInt({ message: 'Rating must be an integer' })
  @Min(1, { message: 'Rating must be at least 1' })
  @Max(5, { message: 'Rating must be at most 5' })
  @IsNotEmpty({ message: 'Rating is required' })
  rating: number;

  
  @ApiProperty({ example: '34' })
  @IsNotEmpty()
  postId: string;
}
  export class AddCommentDtoResponseDto {
    @ApiProperty()
    success: boolean;
    @ApiProperty()
    @IsString()
    result;
    @ApiProperty()
    @IsString()
    message: string;
  }
  