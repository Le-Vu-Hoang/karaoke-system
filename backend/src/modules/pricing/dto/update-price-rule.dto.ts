import { PartialType } from '@nestjs/swagger';
import { CreatePriceRuleDto } from './create-price-rule.dto';

export class UpdatePriceRuleDto extends PartialType(CreatePriceRuleDto) {}
