<div class="image-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="image-content-title"> ${content.title} </h4>
    </#if>
    <#if content.image ? has_content >
    <img src="${damfn.getAssetForId( content.image ).link!}" alt="${content.title!}" />
    </#if>
</div>