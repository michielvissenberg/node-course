import { ApiPropertyOptional } from "@nestjs/swagger";
import { Exclude, Expose } from "class-transformer";
import { IsString, IsOptional } from "class-validator";

@Exclude()
export class SearchProductsQuery {
	@ApiPropertyOptional({ description: "Filter products" })
	@Expose()
	@IsString()
	@IsOptional()
	public search?: string;

	@ApiPropertyOptional({ description: "Filter by given fridge" })
	@Expose()
	@IsString()
	@IsOptional()
	public fridgeId?: string

	@ApiPropertyOptional({ description: "Filter by given location for fridges" })
	@Expose()
	@IsString()
	@IsOptional()
	public fridgeLocation?: string

	@ApiPropertyOptional({ description: "Filter by ownerId" })
	@Expose()
	@IsString()
	@IsOptional()
	public ownerId?: string

}