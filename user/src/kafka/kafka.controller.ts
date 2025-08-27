import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InventoryService } from 'src/inventory/inventory.service';
import { ItemAdd, ItemSub } from './kafka.interface';
import { KafkaTopics } from './kafka.topic';

@Controller()
export class KafkaController {
  constructor(private readonly inventoryService: InventoryService) {}

  @MessagePattern(KafkaTopics.ADD_ITEM)
  async handleCreateRaceResult(@Payload() message: ItemAdd) {
    return this.inventoryService.addItem(
      message.userId,
      message.itemId,
      message.amount,
    );
  }

  @MessagePattern(KafkaTopics.SUB_ITEM)
  async handleCreateBet(@Payload() message: ItemSub) {
    return this.inventoryService.subItem(
      message.userId,
      message.itemId,
      message.amount,
    );
  }
}
