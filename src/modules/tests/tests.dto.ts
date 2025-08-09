import { ApiProperty } from "@nestjs/swagger"
import { Type } from "class-transformer"
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator"

export class InitiateExamSessionDto {
  @ApiProperty()
  @IsNumber()
  step: number
}

export class SubmitAnswerDto {
  @ApiProperty()
  @IsString()
  question: string

  @ApiProperty()
  @IsString()
  selectedOption: string

  @ApiProperty()
  @IsDate()
  questionStartedAt: Date

  @ApiProperty()
  @IsDate()
  answeredAt: Date
}

export class SubmitAnswersDto {
  @ApiProperty({ type: [SubmitAnswerDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => SubmitAnswerDto)
  answers: SubmitAnswerDto[]
}
