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

/**
 *
 * Manages the process of packaging phi modules and it's dependencies.
 * 
 * The manager user Aether to resolve dependencies based on project object models.
 * 
 * @author olivier
 * @param <RD>
 * 
 */

public class PhiPackageManagerModel<RD extends RenderableDefinition> extends RenderingModelImpl<RD> {
    
	public static final String LOCAL_M2_REPOSITORY_PATH = "/home/phi/.m2/repository";
    public static Logger logger = LogManager.getLogger( PhiPackageManagerModel.class ); 
    
    public PhiPackageManagerModel( Node content, RD definition, RenderingModel<?> parent, TemplateDefinitionRegistry registry ) throws Exception {
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
    
    private File[] minifyFiles( boolean minify, File... files ) {
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
    
    private File[] obfuscateFiles( boolean obfuscate, File...files ) {
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
    
    private File concatenateFiles( boolean concatenate, File...files ) {
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
    
    public File resolveFile( boolean concatenate, boolean obfuscate, boolean minify, File...files ) {
        return concatenateFiles( concatenate, obfuscateFiles( obfuscate, minifyFiles( minify, files ) ) );
    }
    
    /**
     * 
     * Resolves the dependencies of an artifact by name.
     * 
     * @param name The name of the artifact
     * @return
     * 
     */
    
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
    
    /**
     * 
     * Resolves the link to download packaged modules
     * 
     * @return link
     * 
     */
    
    public String resolveDownloadLink() {
        return "";
    }
    
    /**
     * 
     * Creates a repository system
     * 
     * @return system
     * 
     */
    
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
    
    /**
     * 
     * Creates a repository system session
     * 
     * @param system A repository system
     * @return session
     * 
     */
    
    private RepositorySystemSession createRepositorySystemSession( RepositorySystem system ) {
        
         DefaultRepositorySystemSession session = MavenRepositorySystemUtils.newSession();

         // TODO : Move repository to property file
         LocalRepository localRepo = new LocalRepository( LOCAL_M2_REPOSITORY_PATH );
         session.setLocalRepositoryManager( system.newLocalRepositoryManager( session, localRepo ) );

         // session.setTransferListener( new ConsoleTransferListener() );
         // session.setRepositoryListener( new ConsoleRepositoryListener() );

         // uncomment to generate dirty trees
         // session.setDependencyGraphTransformer( null );

         return session;
        
    }
    
    /**
     * 
     * Create remote repositories.
     * 
     * @return repositories
     * 
     */
    
    private List<RemoteRepository> createRepositories() {
        List<RemoteRepository> repositories = new ArrayList<RemoteRepository>();
        repositories.add( new RemoteRepository.Builder( "central", "default", "http://central.maven.org/maven2/" ).build() );
        return repositories;
    }

}