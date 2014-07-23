[#if content.image ? has_content ]
    <a href="${damfn.getAssetForId( content.file ).link!}" class="download-action">
        <img src="${damfn.getAssetForId( content.image ).link!}" alt="${content.title!}" />
    </a>
[#else]
    <a href="${damfn.getAssetForId( content.file ).link!}" class="download-action button"> ${content.title!} </a>
[/#if]