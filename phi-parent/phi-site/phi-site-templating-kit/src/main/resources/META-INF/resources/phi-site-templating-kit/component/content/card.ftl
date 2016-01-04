<div class="card-content theme-${content.theme!} ${content.contrast!?string('contrast','')}" cms:edit>
    <#if content.image ? has_content >
    <div class="card-content-image">
        <img src="${damfn.getAssetForId( content.image ).link!}" alt="${content.title!}" />
        <#if content.caption ? has_content >
        <p class="card-content-image-caption">${content.caption!}</p>
        </#if>
    </div>
    </#if>
    <#if content.title ? has_content >
    <h4 class="card-content-title"> ${content.title} </h4>
    </#if>
    <#if content.text ? has_content >
    <div class="card-content-text">
        ${cmsfn.decode(content).text}
    </div>
    </#if>
</div>