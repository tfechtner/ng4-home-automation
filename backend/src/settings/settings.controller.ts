import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SettingsEntity } from './settings.entity';
import { SettingHouseMode } from './settings.model';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
    constructor(
        private readonly _settingsService: SettingsService
    ) {}

    @Get()
    index(): Promise<SettingsEntity[]> {
        return this._settingsService.findAll();
    }

    @Get(':key')
    getSetting(
        @Param('key') key: string
    ): Promise<SettingsEntity[]> {
        return this._settingsService.findByKey(key);
    }

    @Post('save')
    async save(@Body() settingsData: SettingsEntity): Promise<SettingsEntity> {
        return this._settingsService.save(settingsData);
    }

    @Get('set-house-mode/:mode')
    setHouseMode(
        @Param('mode') mode: SettingHouseMode
    ): Promise<SettingsEntity> {
        return this._settingsService.setHouseMode(mode);
    }
}
