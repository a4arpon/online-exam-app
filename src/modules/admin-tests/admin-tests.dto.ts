import { ApiProperty } from "@nestjs/swagger"
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsNumber,
  IsString,
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
