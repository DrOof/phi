<header class="content-header">
    <div class="grid">
        <div class="column phi b">
            <h1 class="content-header-title">${content.title!}</h1>
            <div class="content-header-abstract">
                ${content.abstract!}
            </div>
        </div>
    </div>
</header>
<section class="content-section">
    <div class="grid">
        <@cms.area name = "content" />
    </div>
</section>