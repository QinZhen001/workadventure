import type { BaseTranslation } from "../i18n-types";

const warning: BaseTranslation = {
    title: "Warning!",
    content: `This world is close to its limit!. You can upgrade its capacity <a href="{upgradeLink}" target="_blank">here</a>`,
    limit: "This world is close to its limit!",
    accessDenied: {
        camera: "Camera access denied. Click here and check your browser permissions.",
        screenSharing: "Screen sharing denied. Click here and check your browser permissions.",
        teleport: "You have no right to teleport to this user.",
        room: "Room access denied. You are not allowed to enter this room.",
    },
    importantMessage: "Important message",
    connectionLost: "Connection lost. Reconnecting...",
    connectionLostTitle: "Connection lost",
    connectionLostSubtitle: "Reconnecting",
    waitingConnectionTitle: "Waiting for connection",
    waitingConnectionSubtitle: "Connecting",
    megaphoneNeeds: "To use the megaphone, you must activate your camera or your microphone.",
    mapEditorShortCut: "There was an error while trying to open the map editor.",
    mapEditorNotEnabled: "The map editor is not enabled on this world.",
};

export default warning;
