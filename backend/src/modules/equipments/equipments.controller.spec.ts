import { Test, TestingModule } from '@nestjs/testing';
import { EquipmentsController } from './equipments.controller';

describe('EquipmentsController', () => {
  let controller: EquipmentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EquipmentsController],
    }).compile();

    controller = module.get<EquipmentsController>(EquipmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
