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
                    <th colspan="2">
                        <select>
                            <option value="3.0.2" selected>3.0.2</option>
                            <option value="3.0.1">3.0.1</option>
                            <option value="3.0.0">3.0.0</option>
                            <option value="3.0-SNAPSHOT">3.0-SNAPSHOT</option>
                        </select>
                    </th>
                </tr>
            </thead>
            <tbody>
                <!-- TODO : resolve available modules -->
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
    <!-- table>
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
    </table -->
</div>