<?php

namespace Ilios\CoreBundle\Tests\DependencyInjection;

use Matthias\SymfonyDependencyInjectionTest\PhpUnit\AbstractExtensionTestCase;
use Ilios\CoreBundle\DependencyInjection\IliosCoreExtension;

class IliosCoreExtensionTest extends AbstractExtensionTestCase
{

    protected function getContainerExtensions()
    {
        return array(
            new IliosCoreExtension()
        );
    }

    public function testParametersSet()
    {
        $this->load();
        $parameters = array(
            'ilioscore.aamcmethod.manager.class' => 'Ilios\CoreBundle\Entity\Manager\AamcMethodManager',
            'ilioscore.aamcpcrs.handler.class' => 'Ilios\CoreBundle\Handler\AamcPcrsHandler',
            'ilioscore.aamcpcrs.manager.class' => 'Ilios\CoreBundle\Entity\Manager\AamcPcrsManager',
            'ilioscore.alert.handler.class' => 'Ilios\CoreBundle\Handler\AlertHandler',
            'ilioscore.alert.manager.class' => 'Ilios\CoreBundle\Entity\Manager\AlertManager',
            'ilioscore.alertchangetype.handler.class' => 'Ilios\CoreBundle\Handler\AlertChangeTypeHandler',
            'ilioscore.alertchangetype.manager.class' => 'Ilios\CoreBundle\Entity\Manager\AlertChangeTypeManager',
            'ilioscore.apikey.handler.class' => 'Ilios\CoreBundle\Handler\ApiKeyHandler',
            'ilioscore.apikey.manager.class' => 'Ilios\CoreBundle\Entity\Manager\ApiKeyManager',
            'ilioscore.assessmentoption.handler.class' => 'Ilios\CoreBundle\Handler\AssessmentOptionHandler',
            'ilioscore.assessmentoption.manager.class' => 'Ilios\CoreBundle\Entity\Manager\AssessmentOptionManager',
            'ilioscore.cisession.handler.class' => 'Ilios\CoreBundle\Handler\CISessionHandler',
            'ilioscore.cisession.manager.class' => 'Ilios\CoreBundle\Entity\Manager\CISessionManager',
            'ilioscore.cohort.handler.class' => 'Ilios\CoreBundle\Handler\CohortHandler',
            'ilioscore.cohort.manager.class' => 'Ilios\CoreBundle\Entity\Manager\CohortManager',
            'ilioscore.competency.handler.class' => 'Ilios\CoreBundle\Handler\CompetencyHandler',
            'ilioscore.competency.manager.class' => 'Ilios\CoreBundle\Entity\Manager\CompetencyManager',
            'ilioscore.course.handler.class' => 'Ilios\CoreBundle\Handler\CourseHandler',
            'ilioscore.course.manager.class' => 'Ilios\CoreBundle\Entity\Manager\CourseManager',
            'ilioscore.courseclerkshiptype.handler.class' => 'Ilios\CoreBundle\Handler\CourseClerkshipTypeHandler',
            'ilioscore.courseclerkshiptype.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CourseClerkshipTypeManager',
            'ilioscore.courselearningmaterial.handler.class' =>
            'Ilios\CoreBundle\Handler\CourseLearningMaterialHandler',
            'ilioscore.courselearningmaterial.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CourseLearningMaterialManager',
            'ilioscore.curriculuminventoryacademiclevel.handler.class' =>
            'Ilios\CoreBundle\Handler\CurriculumInventoryAcademicLevelHandler',
            'ilioscore.curriculuminventoryacademiclevel.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CurriculumInventoryAcademicLevelManager',
            'ilioscore.curriculuminventoryexport.handler.class' =>
            'Ilios\CoreBundle\Handler\CurriculumInventoryExportHandler',
            'ilioscore.curriculuminventoryexport.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CurriculumInventoryExportManager',
            'ilioscore.curriculuminventoryinstitution.handler.class' =>
            'Ilios\CoreBundle\Handler\CurriculumInventoryInstitutionHandler',
            'ilioscore.curriculuminventoryinstitution.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CurriculumInventoryInstitutionManager',
            'ilioscore.curriculuminventoryreport.handler.class' =>
            'Ilios\CoreBundle\Handler\CurriculumInventoryReportHandler',
            'ilioscore.curriculuminventoryreport.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CurriculumInventoryReportManager',
            'ilioscore.curriculuminventorysequence.handler.class' =>
            'Ilios\CoreBundle\Handler\CurriculumInventorySequenceHandler',
            'ilioscore.curriculuminventorysequence.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CurriculumInventorySequenceManager',
            'ilioscore.curriculuminventorysequenceblock.handler.class' =>
            'Ilios\CoreBundle\Handler\CurriculumInventorySequenceBlockHandler',
            'ilioscore.curriculuminventorysequenceblock.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CurriculumInventorySequenceBlockManager',
            'ilioscore.curriculuminventorysequenceblocksession.handler.class' =>
            'Ilios\CoreBundle\Handler\CurriculumInventorySequenceBlockSessionHandler',
            'ilioscore.curriculuminventorysequenceblocksession.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\CurriculumInventorySequenceBlockSessionManager',
            'ilioscore.department.handler.class' => 'Ilios\CoreBundle\Handler\DepartmentHandler',
            'ilioscore.department.manager.class' => 'Ilios\CoreBundle\Entity\Manager\DepartmentManager',
            'ilioscore.discipline.handler.class' => 'Ilios\CoreBundle\Handler\DisciplineHandler',
            'ilioscore.discipline.manager.class' => 'Ilios\CoreBundle\Entity\Manager\DisciplineManager',
            'ilioscore.ilmsessionfacet.handler.class' => 'Ilios\CoreBundle\Handler\IlmSessionFacetHandler',
            'ilioscore.ilmsessionfacet.manager.class' => 'Ilios\CoreBundle\Entity\Manager\IlmSessionFacetManager',
            'ilioscore.ingestionexception.handler.class' => 'Ilios\CoreBundle\Handler\IngestionExceptionHandler',
            'ilioscore.ingestionexception.manager.class' => 'Ilios\CoreBundle\Entity\Manager\IngestionExceptionManager',
            'ilioscore.instructionhours.handler.class' => 'Ilios\CoreBundle\Handler\InstructionHoursHandler',
            'ilioscore.instructionhours.manager.class' => 'Ilios\CoreBundle\Entity\Manager\InstructionHoursManager',
            'ilioscore.instructorgroup.handler.class' => 'Ilios\CoreBundle\Handler\InstructorGroupHandler',
            'ilioscore.instructorgroup.manager.class' => 'Ilios\CoreBundle\Entity\Manager\InstructorGroupManager',
            'ilioscore.learnergroup.handler.class' => 'Ilios\CoreBundle\Handler\LearnerGroupHandler',
            'ilioscore.learnergroup.manager.class' => 'Ilios\CoreBundle\Entity\Manager\LearnerGroupManager',
            'ilioscore.learningmaterial.handler.class' => 'Ilios\CoreBundle\Handler\LearningMaterialHandler',
            'ilioscore.learningmaterial.manager.class' => 'Ilios\CoreBundle\Entity\Manager\LearningMaterialManager',
            'ilioscore.learningmaterialstatus.handler.class' =>
            'Ilios\CoreBundle\Handler\LearningMaterialStatusHandler',
            'ilioscore.learningmaterialstatus.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\LearningMaterialStatusManager',
            'ilioscore.learningmaterialuserrole.handler.class' =>
            'Ilios\CoreBundle\Handler\LearningMaterialUserRoleHandler',
            'ilioscore.learningmaterialuserrole.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\LearningMaterialUserRoleManager',
            'ilioscore.meshconcept.handler.class' => 'Ilios\CoreBundle\Handler\MeshConceptHandler',
            'ilioscore.meshconcept.manager.class' => 'Ilios\CoreBundle\Entity\Manager\MeshConceptManager',
            'ilioscore.meshdescriptor.handler.class' => 'Ilios\CoreBundle\Handler\MeshDescriptorHandler',
            'ilioscore.meshdescriptor.manager.class' => 'Ilios\CoreBundle\Entity\Manager\MeshDescriptorManager',
            'ilioscore.meshpreviousindexing.handler.class' => 'Ilios\CoreBundle\Handler\MeshPreviousIndexingHandler',
            'ilioscore.meshpreviousindexing.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\MeshPreviousIndexingManager',
            'ilioscore.meshqualifier.handler.class' => 'Ilios\CoreBundle\Handler\MeshQualifierHandler',
            'ilioscore.meshqualifier.manager.class' => 'Ilios\CoreBundle\Entity\Manager\MeshQualifierManager',
            'ilioscore.meshsemantictype.handler.class' => 'Ilios\CoreBundle\Handler\MeshSemanticTypeHandler',
            'ilioscore.meshsemantictype.manager.class' => 'Ilios\CoreBundle\Entity\Manager\MeshSemanticTypeManager',
            'ilioscore.meshterm.handler.class' => 'Ilios\CoreBundle\Handler\MeshTermHandler',
            'ilioscore.meshterm.manager.class' => 'Ilios\CoreBundle\Entity\Manager\MeshTermManager',
            'ilioscore.meshuserselection.handler.class' => 'Ilios\CoreBundle\Handler\MeshUserSelectionHandler',
            'ilioscore.meshuserselection.manager.class' => 'Ilios\CoreBundle\Entity\Manager\MeshUserSelectionManager',
            'ilioscore.objective.handler.class' => 'Ilios\CoreBundle\Handler\ObjectiveHandler',
            'ilioscore.objective.manager.class' => 'Ilios\CoreBundle\Entity\Manager\ObjectiveManager',
            'ilioscore.offering.handler.class' => 'Ilios\CoreBundle\Handler\OfferingHandler',
            'ilioscore.offering.manager.class' => 'Ilios\CoreBundle\Entity\Manager\OfferingManager',
            'ilioscore.permission.handler.class' => 'Ilios\CoreBundle\Handler\PermissionHandler',
            'ilioscore.permission.manager.class' => 'Ilios\CoreBundle\Entity\Manager\PermissionManager',
            'ilioscore.program.handler.class' => 'Ilios\CoreBundle\Handler\ProgramHandler',
            'ilioscore.program.manager.class' => 'Ilios\CoreBundle\Entity\Manager\ProgramManager',
            'ilioscore.programyear.handler.class' => 'Ilios\CoreBundle\Handler\ProgramYearHandler',
            'ilioscore.programyear.manager.class' => 'Ilios\CoreBundle\Entity\Manager\ProgramYearManager',
            'ilioscore.programyearsteward.handler.class' => 'Ilios\CoreBundle\Handler\ProgramYearStewardHandler',
            'ilioscore.programyearsteward.manager.class' => 'Ilios\CoreBundle\Entity\Manager\ProgramYearStewardManager',
            'ilioscore.publishevent.handler.class' => 'Ilios\CoreBundle\Handler\PublishEventHandler',
            'ilioscore.publishevent.manager.class' => 'Ilios\CoreBundle\Entity\Manager\PublishEventManager',
            'ilioscore.recurringevent.handler.class' => 'Ilios\CoreBundle\Handler\RecurringEventHandler',
            'ilioscore.recurringevent.manager.class' => 'Ilios\CoreBundle\Entity\Manager\RecurringEventManager',
            'ilioscore.report.handler.class' => 'Ilios\CoreBundle\Handler\ReportHandler',
            'ilioscore.report.manager.class' => 'Ilios\CoreBundle\Entity\Manager\ReportManager',
            'ilioscore.reportpovalue.handler.class' => 'Ilios\CoreBundle\Handler\ReportPoValueHandler',
            'ilioscore.reportpovalue.manager.class' => 'Ilios\CoreBundle\Entity\Manager\ReportPoValueManager',
            'ilioscore.school.handler.class' => 'Ilios\CoreBundle\Handler\SchoolHandler',
            'ilioscore.school.manager.class' => 'Ilios\CoreBundle\Entity\Manager\SchoolManager',
            'ilioscore.session.handler.class' => 'Ilios\CoreBundle\Handler\SessionHandler',
            'ilioscore.session.manager.class' => 'Ilios\CoreBundle\Entity\Manager\SessionManager',
            'ilioscore.sessiondescription.handler.class' => 'Ilios\CoreBundle\Handler\SessionDescriptionHandler',
            'ilioscore.sessiondescription.manager.class' => 'Ilios\CoreBundle\Entity\Manager\SessionDescriptionManager',
            'ilioscore.sessionlearningmaterial.handler.class' =>
            'Ilios\CoreBundle\Handler\SessionLearningMaterialHandler',
            'ilioscore.sessionlearningmaterial.manager.class' =>
            'Ilios\CoreBundle\Entity\Manager\SessionLearningMaterialManager',
            'ilioscore.sessiontype.handler.class' => 'Ilios\CoreBundle\Handler\SessionTypeHandler',
            'ilioscore.sessiontype.manager.class' => 'Ilios\CoreBundle\Entity\Manager\SessionTypeManager',
            'ilioscore.user.handler.class' => 'Ilios\CoreBundle\Handler\UserHandler',
            'ilioscore.user.manager.class' => 'Ilios\CoreBundle\Entity\Manager\UserManager',
            'ilioscore.usermadereminder.handler.class' => 'Ilios\CoreBundle\Handler\UserMadeReminderHandler',
            'ilioscore.usermadereminder.manager.class' => 'Ilios\CoreBundle\Entity\Manager\UserMadeReminderManager',
            'ilioscore.userrole.handler.class' => 'Ilios\CoreBundle\Handler\UserRoleHandler',
            'ilioscore.userrole.manager.class' => 'Ilios\CoreBundle\Entity\Manager\UserRoleManager',
            'ilioscore.aamcmethod.handler.class' => 'Ilios\CoreBundle\Handler\AamcMethodHandler',
            'ilioscore.dataloader.users.class' => 'Ilios\CoreBundle\Tests\DataLoader\Users',
        );
        foreach ($parameters as $name => $value) {
            $this->assertContainerBuilderHasParameter($name, $value);
        }
        $services = array(
            'ilioscore.aamcmethod.handler',
            'ilioscore.aamcpcrs.handler',
            'ilioscore.aamcpcrs.manager',
            'ilioscore.alert.handler',
            'ilioscore.alert.manager',
            'ilioscore.alertchangetype.handler',
            'ilioscore.alertchangetype.manager',
            'ilioscore.apikey.handler',
            'ilioscore.apikey.manager',
            'ilioscore.assessmentoption.handler',
            'ilioscore.assessmentoption.manager',
            'ilioscore.cisession.handler',
            'ilioscore.cisession.manager',
            'ilioscore.cohort.handler',
            'ilioscore.cohort.manager',
            'ilioscore.competency.handler',
            'ilioscore.competency.manager',
            'ilioscore.course.handler',
            'ilioscore.course.manager',
            'ilioscore.courseclerkshiptype.handler',
            'ilioscore.courseclerkshiptype.manager',
            'ilioscore.courselearningmaterial.handler',
            'ilioscore.courselearningmaterial.manager',
            'ilioscore.curriculuminventoryacademiclevel.handler',
            'ilioscore.curriculuminventoryacademiclevel.manager',
            'ilioscore.curriculuminventoryexport.handler',
            'ilioscore.curriculuminventoryexport.manager',
            'ilioscore.curriculuminventoryinstitution.handler',
            'ilioscore.curriculuminventoryinstitution.manager',
            'ilioscore.curriculuminventoryreport.handler',
            'ilioscore.curriculuminventoryreport.manager',
            'ilioscore.curriculuminventorysequence.handler',
            'ilioscore.curriculuminventorysequence.manager',
            'ilioscore.curriculuminventorysequenceblock.handler',
            'ilioscore.curriculuminventorysequenceblock.manager',
            'ilioscore.curriculuminventorysequenceblocksession.handler',
            'ilioscore.curriculuminventorysequenceblocksession.manager',
            'ilioscore.department.handler',
            'ilioscore.department.manager',
            'ilioscore.discipline.handler',
            'ilioscore.discipline.manager',
            'ilioscore.ilmsessionfacet.handler',
            'ilioscore.ilmsessionfacet.manager',
            'ilioscore.ingestionexception.handler',
            'ilioscore.ingestionexception.manager',
            'ilioscore.instructionhours.handler',
            'ilioscore.instructionhours.manager',
            'ilioscore.instructorgroup.handler',
            'ilioscore.instructorgroup.manager',
            'ilioscore.learnergroup.handler',
            'ilioscore.learnergroup.manager',
            'ilioscore.learningmaterial.handler',
            'ilioscore.learningmaterialstatus.handler',
            'ilioscore.learningmaterialstatus.manager',
            'ilioscore.learningmaterialuserrole.handler',
            'ilioscore.learningmaterialuserrole.manager',
            'ilioscore.meshconcept.handler',
            'ilioscore.meshconcept.manager',
            'ilioscore.meshdescriptor.handler',
            'ilioscore.meshdescriptor.manager',
            'ilioscore.meshpreviousindexing.handler',
            'ilioscore.meshpreviousindexing.manager',
            'ilioscore.meshqualifier.handler',
            'ilioscore.meshqualifier.manager',
            'ilioscore.meshsemantictype.handler',
            'ilioscore.meshsemantictype.manager',
            'ilioscore.meshterm.handler',
            'ilioscore.meshterm.manager',
            'ilioscore.meshuserselection.handler',
            'ilioscore.meshuserselection.manager',
            'ilioscore.objective.handler',
            'ilioscore.objective.manager',
            'ilioscore.offering.handler',
            'ilioscore.offering.manager',
            'ilioscore.permission.handler',
            'ilioscore.permission.manager',
            'ilioscore.program.handler',
            'ilioscore.program.manager',
            'ilioscore.programyear.handler',
            'ilioscore.programyear.manager',
            'ilioscore.programyearsteward.handler',
            'ilioscore.programyearsteward.manager',
            'ilioscore.publishevent.handler',
            'ilioscore.publishevent.manager',
            'ilioscore.recurringevent.handler',
            'ilioscore.recurringevent.manager',
            'ilioscore.report.handler',
            'ilioscore.report.manager',
            'ilioscore.reportpovalue.handler',
            'ilioscore.reportpovalue.manager',
            'ilioscore.school.handler',
            'ilioscore.school.manager',
            'ilioscore.session.handler',
            'ilioscore.session.manager',
            'ilioscore.sessiondescription.handler',
            'ilioscore.sessiondescription.manager',
            'ilioscore.sessionlearningmaterial.handler',
            'ilioscore.sessionlearningmaterial.manager',
            'ilioscore.sessiontype.handler',
            'ilioscore.sessiontype.manager',
            'ilioscore.user.handler',
            'ilioscore.user.manager',
            'ilioscore.usermadereminder.handler',
            'ilioscore.usermadereminder.manager',
            'ilioscore.userrole.handler',
            'ilioscore.userrole.manager',
            'ilioscore.aamcmethod.manager',
            'ilioscore.dataloader.users',
        );
        foreach ($services as $service) {
            $this->assertContainerBuilderHasService($service);
        }
    }
}
