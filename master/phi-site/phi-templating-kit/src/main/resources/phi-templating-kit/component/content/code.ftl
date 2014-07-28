<div class="code-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="code-content-title"> ${content.title} </h4>
    </#if>
    <code class="prettyprint ${content.lang}">${content.code}</code>
</div>