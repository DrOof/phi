<div class="graph-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="graph-content-title"> ${content.title} </h4>
    </#if>
    <div class="graph ${content.type!}" data='[{ "x": 1, "y": 1 }, { "x": 2, "y": 2 }]' options="{}" rel="graph-create" type="${content.type!}"></div>
</div>