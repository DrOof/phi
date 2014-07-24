<div class="image-content" cms:edit>
    <#if content.title ? has_content >
    <p class="image-content-title"> ${content.title} </p>
    </#if>
    <#if content.image ? has_content >
    <img src="${damfn.getAssetForId( content.image ).link!}" alt="${content.title!}" />
    </#if>
</div>