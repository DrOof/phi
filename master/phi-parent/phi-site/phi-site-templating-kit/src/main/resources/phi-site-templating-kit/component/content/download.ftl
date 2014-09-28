<div class="download-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="download-content-title"> ${content.title} </h4>
    </#if>
    <table>
        <thead>
            <tr>
                <th>Group Id</th>
                <th>Artifact Id</th>
                <th>Version</th>
            </tr>
        </thead>
        <tbody>
            <#list model.resolveDependencies( "guru.phi:phi-js-dom:3.0-SNAPSHOT" ).dependencies as dependency>
                <tr>
                    <td>${dependency.artifact.groupId}</td>
                    <td>${dependency.artifact.artifactId}</td>
                    <td>${dependency.artifact.version}</td>
                </tr>
            </#list>
        </tbody>
    </table>
</div>