import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsString, IsUUID } from "class-validator";

@Exclude()
export class RecipeView {
    @ApiProperty({format: "uuid"})
    @Expose()
    @IsUUID()
    public id: string;
    

    @ApiProperty()
    @Expose()
    @IsString()
    public name: string;
    
    @ApiProperty()
    @Expose()
    @IsString()
    public description: string;
}
