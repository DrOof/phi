<div class="text-content" cms:edit>
    <#if content.title ? has_content >
    <p class="text-content-title"> ${content.title} </p>
    </#if>
    <div class="text">
    <#if content.description ? has_content >
        ${cmsfn.decode(content).description}
    </#if>
    </div>
</div>