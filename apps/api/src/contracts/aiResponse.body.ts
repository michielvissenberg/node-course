import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsArray, IsOptional, IsString } from "class-validator";
import { AiResponseIngredientBody } from "./aiResponseIngredient.body";

@Exclude()
export class AiResponseBody{
    @ApiProperty()
    @Expose()
    @IsString()
    @IsOptional()
    public name: string;

    @ApiProperty({ type: [AiResponseIngredientBody] })
    @Expose()
    @IsArray()
    @IsOptional()
    public ingredients: AiResponseIngredientBody[];

    @ApiProperty()
    @Expose()
    @IsString()
    @IsOptional()
    public description: string;

    @ApiProperty()
    @Expose()
    @IsString()
    @IsOptional()
    public steps: string[];
}