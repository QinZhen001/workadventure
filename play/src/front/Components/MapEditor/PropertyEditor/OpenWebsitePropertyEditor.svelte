<script lang="ts">
    import axios from "axios";
    import { createEventDispatcher } from "svelte";
    import { OpenWebsitePropertyData } from "@workadventure/map-editor";
    import { LL } from "../../../../i18n/i18n-svelte";
    import { onMapEditorInputFocus, onMapEditorInputUnfocus } from "../../../Stores/MapEditorStore";
    import webSvg from "../../images/web-white.svg";
    import PropertyEditorBase from "./PropertyEditorBase.svelte";

    export let property: OpenWebsitePropertyData;
    export let triggerOnActionChoosen: boolean = property.trigger === "onaction";
    let optionAdvancedActivated = false;
    let embedable = true;

    const dispatch = createEventDispatcher();

    function onTriggerValueChange() {
        triggerOnActionChoosen = property.trigger === "onaction";
        dispatch("change");
    }

    function onNewTabValueChange() {
        if (property.newTab) {
            if (property.trigger === "onicon") {
                property.trigger = undefined;
            }
        }
        dispatch("change");
    }

    function onValueChange() {
        dispatch("change");
    }

    async function checkEmbedableWebsite() {
        await axios
            .get(property.link)
            .then((data) => {
                embedable = data.headers["x-frame-options"] && data.headers["x-frame-options"] != "sameorigin";
            })
            .catch((e) => {
                embedable = false;
                console.info("Error to check embedable website", e);
            });
    }
</script>

<PropertyEditorBase
    on:close={() => {
        dispatch("close");
    }}
>
    <span slot="header" class="tw-flex tw-justify-center tw-items-center">
        <img class="tw-w-6 tw-mr-1" src={webSvg} alt={$LL.mapEditor.properties.linkProperties.description()} />
        {$LL.mapEditor.properties.linkProperties.label()}
    </span>
    <span slot="content">
        <div>
            <label class="tw-m-0" for="trigger">{$LL.mapEditor.properties.linkProperties.trigger()}</label>
            <select
                id="trigger"
                class="tw-w-full tw-m-0"
                bind:value={property.trigger}
                on:change={onTriggerValueChange}
            >
                <option value={undefined}>{$LL.mapEditor.properties.linkProperties.triggerShowImmediately()}</option>
                {#if !property.newTab}
                    <option value="onicon">{$LL.mapEditor.properties.linkProperties.triggerOnClick()}</option>
                {/if}
                <option value="onaction">{$LL.mapEditor.properties.linkProperties.triggerOnAction()}</option>
            </select>
        </div>
        <div class="value-input tw-flex tw-flex-col">
            <label for="tabLink">{$LL.mapEditor.properties.linkProperties.linkLabel()}</label>
            <input
                id="tabLink"
                type="text"
                placeholder={$LL.mapEditor.properties.linkProperties.linkPlaceholder()}
                bind:value={property.link}
                on:change={onValueChange}
                on:focus={onMapEditorInputFocus}
                on:blur={onMapEditorInputUnfocus}
                on:blur={checkEmbedableWebsite}
            />
            {#if !embedable}
                <span class="err tw-text-pop-red tw-text-xs tw-italic"
                    >{$LL.mapEditor.properties.linkProperties.errorEmbeddableLink()}</span
                >
            {/if}
        </div>
        {#if !property.hideButtonLabel}
            <div class="value-input tw-flex tw-flex-col">
                <label for="linkButton">{$LL.mapEditor.entityEditor.buttonLabel()}</label>
                <input
                    id="linkButton"
                    type="text"
                    bind:value={property.buttonLabel}
                    on:change={onValueChange}
                    on:focus={onMapEditorInputFocus}
                    on:blur={onMapEditorInputUnfocus}
                />
            </div>
        {/if}
        <div class="value-switch">
            <label for="advancedOption">{$LL.mapEditor.properties.advancedOptions()}</label>
            <input id="advancedOption" type="checkbox" class="input-switch" bind:checked={optionAdvancedActivated} />
        </div>
        <div class:active={optionAdvancedActivated} class="advanced-option tw-px-2">
            {#if triggerOnActionChoosen}
                <div class="value-input tw-flex tw-flex-col">
                    <label for="triggerMessage">{$LL.mapEditor.properties.linkProperties.triggerMessage()}</label>
                    <input
                        id="triggerMessage"
                        type="text"
                        bind:value={property.triggerMessage}
                        on:change={onValueChange}
                        on:focus={onMapEditorInputFocus}
                        on:blur={onMapEditorInputUnfocus}
                    />
                </div>
            {/if}
            <div class="value-switch">
                <label for="newTab">{$LL.mapEditor.properties.linkProperties.newTabLabel()}</label>
                <input
                    id="newTab"
                    type="checkbox"
                    class="input-switch"
                    bind:checked={property.newTab}
                    on:change={onNewTabValueChange}
                />
            </div>
            {#if !property.newTab}
                <div class="">
                    <label for="websiteWidth"
                        >{$LL.mapEditor.properties.linkProperties.width()}: {property.width ?? 50}%</label
                    >
                    <input
                        id="websiteWidth"
                        type="range"
                        min="0"
                        max="100"
                        placeholder="50"
                        bind:value={property.width}
                        on:change={onValueChange}
                    />
                </div>
            {/if}
            <div class="value-switch">
                <label for="closable">{$LL.mapEditor.properties.linkProperties.closable()}</label>
                <input
                    id="closable"
                    type="checkbox"
                    class="input-switch"
                    bind:checked={property.closable}
                    on:change={onValueChange}
                />
            </div>
            <div class="value-switch">
                <label for="allowAPI">{$LL.mapEditor.properties.linkProperties.allowAPI()}</label>
                <input
                    id="allowAPI"
                    type="checkbox"
                    class="input-switch"
                    bind:checked={property.allowAPI}
                    on:change={onValueChange}
                />
            </div>
            <div class="value-input tw-flex tw-flex-col">
                <label for="policy">{$LL.mapEditor.properties.linkProperties.policy()}</label>
                <input
                    id="policy"
                    type="text"
                    placeholder={$LL.mapEditor.properties.linkProperties.policyPlaceholder()}
                    bind:value={property.policy}
                    on:change={onValueChange}
                    on:focus={onMapEditorInputFocus}
                    on:blur={onMapEditorInputUnfocus}
                />
            </div>
        </div>
    </span>
</PropertyEditorBase>

<style lang="scss">
    .value-input {
        display: flex;
        width: 100%;
        margin-bottom: 0.5em;
        margin-top: 0.5em;
        flex-direction: column;
        label {
            min-width: fit-content;
            margin-right: 0.5em;
        }
        input {
            flex-grow: 1;
            min-width: 0;
        }
        * {
            margin-bottom: 0;
        }
    }
    .value-switch {
        display: flex;
        width: 100%;
        margin-bottom: 0.5em;
        margin-top: 0.5em;
        align-items: center;
        height: 2.5em;
        label {
            min-width: fit-content;
            margin-right: 0.5em;
            flex-grow: 1;
        }
        input {
            min-width: 0;
        }
        * {
            margin-bottom: 0;
        }
    }
    .value-switch {
        display: flex;
        width: 100%;
        margin-bottom: 0.5em;
        margin-top: 0.5em;
        align-items: center;
        height: 2.5em;
        label {
            min-width: fit-content;
            margin-right: 0.5em;
            flex-grow: 1;
        }
        input {
            min-width: 0;
        }
        * {
            margin-bottom: 0;
        }
    }
    .input-switch {
        position: relative;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        display: inline-block;
        height: 1rem;
        width: 2rem;
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        border-radius: 9999px;
        border-width: 1px;
        border-style: solid;
        --tw-border-opacity: 1;
        border-color: rgb(77 75 103 / var(--tw-border-opacity));
        --tw-bg-opacity: 1;
        background-color: rgb(15 31 45 / var(--tw-bg-opacity));
        background-image: none;
        padding: 0px;
        --tw-text-opacity: 1;
        color: rgb(242 253 255 / var(--tw-text-opacity));
        outline: 2px solid transparent;
        outline-offset: 2px;
        cursor: url(/src/front/style/images/cursor_pointer.png), pointer;
    }
    .input-switch::before {
        position: absolute;
        left: -3px;
        top: -3px;
        height: 1.25rem;
        width: 1.25rem;
        border-radius: 9999px;
        --tw-bg-opacity: 1;
        background-color: rgb(146 142 187 / var(--tw-bg-opacity));
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        --tw-content: "";
        content: var(--tw-content);
    }
    .input-switch:checked {
        --tw-border-opacity: 1;
        border-color: rgb(146 142 187 / var(--tw-border-opacity));
    }
    .input-switch:checked::before {
        left: 13px;
        top: -3px;
        --tw-bg-opacity: 1;
        background-color: rgb(65 86 246 / var(--tw-bg-opacity));
        content: var(--tw-content);
        /*--tw-shadow: 0 0 7px 0 rgba(4, 255, 210, 1);
        --tw-shadow-colored: 0 0 7px 0 var(--tw-shadow-color);
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);*/
    }
    .input-switch:disabled {
        cursor: not-allowed;
        opacity: 0.4;
    }
    .advanced-option {
        display: none;
        &.active {
            display: block;
        }
    }
</style>
