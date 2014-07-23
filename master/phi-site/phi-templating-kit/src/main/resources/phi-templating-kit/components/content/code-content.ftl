<div class="code-content" cms:edit>
    [#if content.title ? has_content ]
    <p class="code-content-title"> ${content.title} </p>
    [/#if]
    <code class="prettyprint ${content.lang}">${content.code}</code>
</div>