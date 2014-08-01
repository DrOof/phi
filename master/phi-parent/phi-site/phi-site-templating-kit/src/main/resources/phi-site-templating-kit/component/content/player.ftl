<div class="player-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="player-content-title"> ${content.title} </h4>
    </#if>
	<#if content.media ? has_content >
        <div class="player" src="${damfn.getAssetForId( content.media ).link!}" controls></div>
    </#if>
</div>