<div class="text-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="text-content-title"> ${content.title} </h4>
    </#if>
    <#if content.text ? has_content >
        <div class="text">
            ${cmsfn.decode(content).text}
        </div>
    </#if>
</div>