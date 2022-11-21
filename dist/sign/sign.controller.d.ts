import { SignService } from './sign.service';
import { CreateSignDto } from './dto/create-sign.dto';
import { UpdateSignDto } from './dto/update-sign.dto';
export declare class SignController {
    private readonly signService;
    constructor(signService: SignService);
    create(createSignDto: CreateSignDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateSignDto: UpdateSignDto): string;
    remove(id: string): string;
}
