import { CommandConfig, MegaphoneSettings, WAMFileFormat } from "../../types";
import { Command } from "../Command";

export interface UpdateWAMSettingCommandConfig {
    type: "UpdateWAMSettingCommand";
    name: string;
    dataToModify: MegaphoneSettings | undefined;
}

export class UpdateWAMSettingCommand extends Command {
    private readonly oldConfig: MegaphoneSettings | undefined;
    constructor(private wam: WAMFileFormat, private command: UpdateWAMSettingCommandConfig, id?: string) {
        super(id);
        if (this.command.name === "megaphone") {
            this.oldConfig = this.wam.settings?.megaphone;
        }
    }

    execute(): CommandConfig {
        if (this.wam.settings === undefined) {
            this.wam.settings = {};
        }
        // NOTE : Override the old config with the new config even if the new one is partially defined
        const newSettings: MegaphoneSettings = {
            scope: this.command.dataToModify?.scope ?? this.oldConfig?.scope,
            title: this.command.dataToModify?.title ?? this.oldConfig?.title,
            rights: this.command.dataToModify?.rights ?? this.oldConfig?.rights,
            enabled: this.command.dataToModify?.enabled ?? this.oldConfig?.enabled ?? false,
        };
        if (this.command.name === "megaphone") {
            this.wam.settings.megaphone = newSettings;
        }
        return { type: "UpdateWAMSettingCommand", name: this.command.name, dataToModify: newSettings };
    }

    undo(): CommandConfig {
        if (this.wam.settings === undefined) {
            this.wam.settings = {};
        }
        if (this.command.name === "megaphone") {
            this.wam.settings.megaphone = this.oldConfig;
        }
        return { type: "UpdateWAMSettingCommand", name: this.command.name, dataToModify: this.oldConfig };
    }
}
