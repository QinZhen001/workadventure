<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { LL } from "../../../../i18n/i18n-svelte";
    import silentSvg from "../../images/silent-white.svg";
    import PropertyEditorBase from "./PropertyEditorBase.svelte";

    const dispatch = createEventDispatcher();
</script>

<PropertyEditorBase
    on:close={() => {
        dispatch("close");
    }}
>
    <span slot="header" class="tw-flex tw-justify-center tw-items-center">
        <img class="tw-w-6 tw-mr-1" src={silentSvg} alt={$LL.mapEditor.properties.silentProperty.description()} />
        {$LL.mapEditor.properties.silentProperty.label()}
    </span>
</PropertyEditorBase>

<style lang="scss">
</style>
