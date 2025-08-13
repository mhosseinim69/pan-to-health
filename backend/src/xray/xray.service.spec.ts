import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { XrayService } from './xray/xray.service';
import { Signal } from './schemas/signal.schema/signal.schema';

describe('XrayService', () => {
  let service: XrayService;
  let model: any;

  beforeEach(async () => {
    model = {
      save: jest.fn().mockResolvedValue({ _id: 'mockId' }),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        XrayService,
        {
          provide: getModelToken(Signal.name),
          useValue: jest.fn(() => model),
        },
      ],
    }).compile();

    service = module.get<XrayService>(XrayService);
  });

  it('should save signal from x-ray data', async () => {
    const data = { data: [[0, [0, 0, 1]]], time: Date.now() };
    const result = await service.saveFromXray('device123', data);
    expect(model.save).toHaveBeenCalled();
    expect(result._id).toBe('mockId');
  });
});
