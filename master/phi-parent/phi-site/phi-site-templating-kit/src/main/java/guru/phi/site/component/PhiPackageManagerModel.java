package guru.phi.site.component;

import info.magnolia.rendering.model.RenderingModel;
import info.magnolia.rendering.model.RenderingModelImpl;
import info.magnolia.rendering.template.RenderableDefinition;
import info.magnolia.rendering.template.registry.TemplateDefinitionRegistry;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;

import org.apache.log4j.LogManager;
import org.apache.log4j.Logger;
import org.apache.maven.repository.internal.MavenRepositorySystemUtils;
import org.eclipse.aether.DefaultRepositorySystemSession;
import org.eclipse.aether.RepositorySystem;
import org.eclipse.aether.RepositorySystemSession;
import org.eclipse.aether.artifact.Artifact;
import org.eclipse.aether.artifact.DefaultArtifact;
import org.eclipse.aether.connector.basic.BasicRepositoryConnectorFactory;
import org.eclipse.aether.impl.DefaultServiceLocator;
import org.eclipse.aether.repository.LocalRepository;
import org.eclipse.aether.repository.RemoteRepository;
import org.eclipse.aether.resolution.ArtifactDescriptorException;
import org.eclipse.aether.resolution.ArtifactDescriptorRequest;
import org.eclipse.aether.resolution.ArtifactDescriptorResult;
import org.eclipse.aether.spi.connector.RepositoryConnectorFactory;
import org.eclipse.aether.spi.connector.transport.TransporterFactory;
import org.eclipse.aether.transport.file.FileTransporterFactory;
import org.eclipse.aether.transport.http.HttpTransporterFactory;

// FIXME : move to phi-site-package-manager module
public class PhiPackageManagerModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
    
    public static Logger logger = LogManager.getLogger( PhiPackageManagerModel.class ); 
    
    public static final String PHI_JS_COLOR     = "phi-js-color";
    public static final String PHI_JS_CORE      = "phi-js-core";
    public static final String PHI_JS_DIALOG    = "phi-js-dialog";
    public static final String PHI_JS_DOM       = "phi-js-dom";
    public static final String PHI_JS_EXT       = "phi-js-ext";
    public static final String PHI_JS_FORM      = "phi-js-form";
    public static final String PHI_JS_GRAPH     = "phi-js-graph";
    public static final String PHI_JS_MEDIA     = "phi-js-media";
    public static final String PHI_JS_SLIDER    = "phi-js-slider";
    
    public PhiPackageManagerModel( Node content, RD definition, RenderingModel<?> parent, TemplateDefinitionRegistry templateDefinitions ) throws Exception {
        super( content, definition, parent );
    }

    @Override
    public String execute() {
        return super.execute();
    }
    
    /**
     * 
     * Minify files
     * 
     * @param files
     * @return files
     * 
     */
    
    private File[] minifyFiles( File... files ) {
        return files;
    }
    
    /**
     * 
     * Obfuscate files
     * 
     * @param files
     * @return files
     * 
     */
    
    private File[] obfuscateFiles( File...files ) {
        return files;
    }
    
    /**
     * 
     * Concatenate files
     * 
     * @param files
     * @return file
     * 
     */
    
    private File concatenateFiles( File...files ) {
        return files[0];
    }
    
    /**
     * 
     * Resolve file for download.
     * 
     * @param files
     * @return
     * 
     */
    
    public File resolveFile( File...files ) {
        
        
        return concatenateFiles( obfuscateFiles( minifyFiles( files ) ) );
        
    }
    
    private RepositorySystem createRepositorySystem() {
                
        DefaultServiceLocator locator = MavenRepositorySystemUtils.newServiceLocator();
        locator.addService( RepositoryConnectorFactory.class, BasicRepositoryConnectorFactory.class );
        locator.addService( TransporterFactory.class, FileTransporterFactory.class );
        locator.addService( TransporterFactory.class, HttpTransporterFactory.class );

        locator.setErrorHandler( new DefaultServiceLocator.ErrorHandler() {
                @Override
                public void serviceCreationFailed( Class<?> type, Class<?> impl, Throwable e ) {
                    // 
                }
            } 
        );

        return locator.getService( RepositorySystem.class );
        
        
    }
    
    private RepositorySystemSession createRepositorySystemSession( RepositorySystem system ) {
        
         DefaultRepositorySystemSession session = MavenRepositorySystemUtils.newSession();

         LocalRepository localRepo = new LocalRepository( "~/.m2/repository" );
         session.setLocalRepositoryManager( system.newLocalRepositoryManager( session, localRepo ) );

         // session.setTransferListener( new ConsoleTransferListener() );
         // session.setRepositoryListener( new ConsoleRepositoryListener() );

         // uncomment to generate dirty trees
         // session.setDependencyGraphTransformer( null );

         return session;
        
    }
    
    private List<RemoteRepository> createRepositories() {
        List<RemoteRepository> repositories = new ArrayList<RemoteRepository>();
        repositories.add( new RemoteRepository.Builder( "central", "default", "http://central.maven.org/maven2/" ).build() );
        return repositories;
    }
    
    // "guru.phi:phi-js-core:3.0.0"
    public ArtifactDescriptorResult resolveDependencies( String name ) {
        
        // TODO: Create a system
        RepositorySystem system = createRepositorySystem();
        
        // TODO : Create a session 
        RepositorySystemSession session = createRepositorySystemSession( system );
        
        // TODO : Define an artifact
        Artifact artifact = new DefaultArtifact( name );
        
        // TODO : Create a request
        ArtifactDescriptorRequest request = new ArtifactDescriptorRequest();
        
        // TODO : set the root of the request
        request.setArtifact( artifact );
        
        // TODO : set the repositories of the request
        request.setRepositories( createRepositories() );
        
        // TODO : Create a result
        ArtifactDescriptorResult result = null;
        try {
            result = system.readArtifactDescriptor( session, request );
        } catch ( ArtifactDescriptorException e ) {
            logger.error( e );
        }
                        
        return result;

    }
    
    public String resolveDownloadLink() {
        return "";
    }

}