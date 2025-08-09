import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator"

export type QuestionLevelType = "A1" | "A2" | "B1" | "B2" | "C1" | "C2"

export class CreateQuestionDto {
  @ApiProperty()
  @IsString()
  competency: string

  @ApiProperty({
    enum: ["A1", "A2", "B1", "B2", "C1", "C2"],
  })
  @IsString()
  @IsIn(["A1", "A2", "B1", "B2", "C1", "C2"])
  level: QuestionLevelType

  @ApiProperty()
  @IsString()
  questionText: string

  @ApiProperty()
  @IsArray()
  @ArrayMinSize(2)
  @IsString({ each: true })
  options: string[]

  @ApiProperty()
  @IsString()
  correctAnswer: string

  @ApiProperty()
  @IsNumber()
  timeLimit: number
}

export class CreateQuestionsBulkDto {
  @ApiProperty({ type: CreateQuestionDto, isArray: true, minItems: 1 })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  questions: CreateQuestionDto[]
}
