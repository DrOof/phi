<#if content.image ? has_content >
    <a href="${content.link!}" class="external-action">
        <img src="${damfn.getAssetForId( content.image ).link!}" alt="${content.title!}" />
    </a>
<#else>
    <a href="${content.link!}" class="external-action button"> ${content.title!} </a>
</#if>