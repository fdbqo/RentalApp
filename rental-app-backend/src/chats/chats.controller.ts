import { Controller, Get, Query, Param } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { GetChatDto } from './dto/get-chat.dto';

@Controller('chats')
export class ChatsController {
    constructor(private readonly chatsService: ChatsService) {}

    @Get(':propertyId')
    async getPropertyChats(
        @Param('propertyId') propertyId: string,
        @Query() getChatDto: GetChatDto
    ) {
        return this.chatsService.findByProperty(propertyId, getChatDto);
    }
}