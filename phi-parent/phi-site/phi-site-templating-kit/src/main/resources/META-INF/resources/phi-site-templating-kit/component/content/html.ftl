<div class="html-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="html-content-title"> ${content.title} </h4>
    </#if>
    ${cmsfn.decode(content).html}
</div>