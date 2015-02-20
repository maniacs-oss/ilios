<?php

namespace Ilios\CoreBundle\Entity\Manager;

use Doctrine\ORM\EntityManager;
use Doctrine\ORM\EntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Ilios\CoreBundle\Entity\CurriculumInventoryInstitutionInterface;

/**
 * CurriculumInventoryInstitution manager service.
 * Class CurriculumInventoryInstitutionManager
 * @package Ilios\CoreBundle\Manager
 */
class CurriculumInventoryInstitutionManager implements CurriculumInventoryInstitutionManagerInterface
{
    /**
     * @var EntityManager
     */
    protected $em;

    /**
     * @var EntityRepository
     */
    protected $repository;

    /**
     * @var string
     */
    protected $class;

    /**
     * @param EntityManager $em
     * @param string $class
     */
    public function __construct(EntityManager $em, $class)
    {
        $this->em         = $em;
        $this->class      = $class;
        $this->repository = $em->getRepository($class);
    }

    /**
     * @param array $criteria
     * @param array $orderBy
     *
     * @return CurriculumInventoryInstitutionInterface
     */
    public function findCurriculumInventoryInstitutionBy(
        array $criteria,
        array $orderBy = null
    ) {
        return $this->repository->findOneBy($criteria, $orderBy);
    }

    /**
     * @param array $criteria
     * @param array $orderBy
     * @param integer $limit
     * @param integer $offset
     *
     * @return CurriculumInventoryInstitutionInterface[]|Collection
     */
    public function findCurriculumInventoryInstitutionsBy(
        array $criteria,
        array $orderBy = null,
        $limit = null,
        $offset = null
    ) {
        return $this->repository->findBy($criteria, $orderBy, $limit, $offset);
    }

    /**
     * @param CurriculumInventoryInstitutionInterface $curriculumInventoryInstitution
     * @param bool $andFlush
     */
    public function updateCurriculumInventoryInstitution(
        CurriculumInventoryInstitutionInterface $curriculumInventoryInstitution,
        $andFlush = true
    ) {
        $this->em->persist($curriculumInventoryInstitution);
        if ($andFlush) {
            $this->em->flush();
        }
    }

    /**
     * @param CurriculumInventoryInstitutionInterface $curriculumInventoryInstitution
     */
    public function deleteCurriculumInventoryInstitution(
        CurriculumInventoryInstitutionInterface $curriculumInventoryInstitution
    ) {
        $this->em->remove($curriculumInventoryInstitution);
        $this->em->flush();
    }

    /**
     * @return string
     */
    public function getClass()
    {
        return $this->class;
    }

    /**
     * @return CurriculumInventoryInstitutionInterface
     */
    public function createCurriculumInventoryInstitution()
    {
        $class = $this->getClass();
        return new $class();
    }
}