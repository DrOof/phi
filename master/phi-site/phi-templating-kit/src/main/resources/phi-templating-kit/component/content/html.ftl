<div class="html-content" cms:edit>
    <#if content.title ? has_content >
    <p class="html-content-title"> ${content.title} </p>
    </#if>
    ${cmsfn.decode(content).html}
</div>