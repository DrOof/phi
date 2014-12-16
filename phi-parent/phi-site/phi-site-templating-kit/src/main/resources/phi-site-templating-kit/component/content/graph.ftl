<div class="graph-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="graph-content-title"> ${content.title} </h4>
    </#if>
    <div class="graph ${content.type!}" data-src="${content.src!}"></div>
</div>