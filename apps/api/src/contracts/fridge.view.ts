import { ApiProperty } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsNumber, IsString, IsUUID } from "class-validator";

@Exclude()
export class FridgeView {
  @ApiProperty({ format: "uuid" })
  @Expose()
  @IsUUID()
  public id: string;

  @ApiProperty()
  @Expose()
  @IsString()
  public address: string;

  @ApiProperty()
  @Expose()
  @IsNumber()
  public floor: number;

  @ApiProperty()
  @Expose()
  @IsNumber()
  public capacity: number;
}