import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose, Type } from "class-transformer";
import { IsArray, IsOptional, IsString, ValidateNested } from "class-validator";
import { AiResponseIngredientBody } from "./aiResponseIngredient.body";

@Exclude()
export class AiResponseBody{
    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public name: string;

    @ApiPropertyOptional({ type: [AiResponseIngredientBody] })
    @Expose()
    @IsArray()
    @IsOptional()
    public ingredients: AiResponseIngredientBody[];

    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public description: string;

    @ApiPropertyOptional()
    @Expose()
    @IsString()
    @IsOptional()
    public steps: string[];
}