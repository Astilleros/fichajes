import { CreateSignDto } from './dto/create-sign.dto';
import { UpdateSignDto } from './dto/update-sign.dto';
export declare class SignService {
    create(createSignDto: CreateSignDto): string;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateSignDto: UpdateSignDto): string;
    remove(id: number): string;
}
