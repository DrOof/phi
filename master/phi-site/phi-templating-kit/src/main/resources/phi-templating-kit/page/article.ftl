<section class="content">
    <div class="grid">
        <div class="column phi b">
            <h1 class="content-title">${content.title!}</h1>
            <div class="content-abstract">
                ${content.abstract!}
            </div>
        </div>
    </div>
    <div class="grid">
        <@cms.area name = "content" />
    </div>
</section>