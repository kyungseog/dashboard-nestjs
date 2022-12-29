import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { LiveCommerces } from 'src/entities/live-commerces.entity';

@Injectable()
export class LiveCommercesService {
  constructor(
    @InjectRepository(LiveCommerces)
    private liveCommerceRepository: Repository<LiveCommerces>,
  ) {}
}
