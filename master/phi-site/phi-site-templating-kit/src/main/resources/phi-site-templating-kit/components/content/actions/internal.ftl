[#if content.image ? has_content ]
    <a href="${defaultBaseUrl}${content.link!}[#if content.hash ? has_content]#${content.hash}[/#if]" class="internal-link">
        <img src="${damfn.getAssetForId( content.image ).link!}" alt="${content.title!}" />
    </a>
[#else]
    <a href="${defaultBaseUrl}${content.link!}[#if content.hash ? has_content]#${content.hash}[/#if]" class="internal-link button"> ${content.title!} </a>
[/#if]