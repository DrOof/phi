<!-- FIXME : rename to package-manager.ftl -->
<div class="package-manager-content" cms:edit>
    <#if content.title ? has_content >
    <h4 class="package-manager-content-title"> ${content.title} </h4>
    </#if>
    <form action="#" method="get">
        <table>
            <thead>
                <tr>
                    <th>Component</th>
                    <th>
                        <select>
                            <#list model.resolveAvailableVersionsByName( "guru.phi:phi-js:[0,)" ).versions as version>
                                <option value="${version}">${version}</option>
                            </#list>
                        </select>
                    </th>
                    <th>
                        <label>
                            <input type="checkbox" /> Minify
                        </label>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{module.artifact.artifactId}</td>
                    <td>{module.artifact.version}</td>
                    <td>
                        <input type="checkbox" name="" id="" selected />
                    </td>
                </tr>
            </tbody>
        </table>
    </form>
    <#-- table>
        <thead>
            <tr>
                <th>Group Id</th>
                <th>Artifact Id</th>
                <th>Version</th>
            </tr>
        </thead>
        <tbody>
            <#list model.resolveDependenciesByName( "guru.phi:phi-js-dom:3.0-SNAPSHOT" ).dependencies as dependency>
                <tr>
                    <td>${dependency.artifact.groupId}</td>
                    <td>${dependency.artifact.artifactId}</td>
                    <td>${dependency.artifact.version}</td>
                </tr>
            </#list>
        </tbody>
    </table -->
</div>