
import { prisma } from "@/lib/prisma";
import { connection } from "next/server";
import {
  createFormation,
  updateFormation,
  deleteFormation,
  createCours,
  updateCours,
  deleteCours,
  createEtudiant,
  updateEtudiant,
  deleteEtudiant,
  createProfil,
  updateProfil,
  deleteProfil,
} from "./actions";

export const instant = false;

export default async function GestionPage() {
  await connection();

  const formations = await prisma.formation.findMany({
    include: { cours: true, etudiants: true },
    orderBy: { id: "desc" },
  });

  const etudiants = await prisma.etudiant.findMany({
    include: { profil: true, formations: true },
    orderBy: { id: "desc" },
  });

  const inputStyle =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelStyle =
    "mb-2 block text-sm font-semibold text-slate-700";

  const sectionStyle =
    "rounded-2xl border border-slate-200 bg-white p-7 shadow-sm space-y-6";

  const btnAjouter =
    "rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700";

  const btnModifier =
    "rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-amber-600";

  const btnSupprimer =
    "rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600";

  const sousTitre =
    "border-b border-slate-200 pb-4 text-lg font-bold text-slate-800";

  return (
    <main className="min-h-screen bg-slate-100 p-5 md:p-10">
      <div className="mx-auto max-w-6xl space-y-12">

        {/* EN-TETE */}
        <header className="rounded-2xl bg-gradient-to-r from-slate-900 to-blue-900 p-10 text-white shadow-lg">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-300">
            Administration
          </p>

          <h1 className="text-3xl font-bold">
            Gestion des formations
          </h1>

          <p className="mt-3 text-slate-300">
            Gérez vos formations, vos cours et vos étudiants.
          </p>

          <div className="mt-8 flex flex-wrap gap-5">
            <div className="rounded-xl bg-white/10 px-6 py-4">
              <p className="text-2xl font-bold">{formations.length}</p>
              <p className="mt-1 text-sm text-blue-200">Formations</p>
            </div>

            <div className="rounded-xl bg-white/10 px-6 py-4">
              <p className="text-2xl font-bold">{etudiants.length}</p>
              <p className="mt-1 text-sm text-blue-200">Étudiants</p>
            </div>
          </div>
        </header>

        {/* AJOUT */}
        <section className="space-y-6">
          <h2 className="border-b border-slate-200 pb-4 text-2xl font-bold text-slate-800">
            Ajouter de nouveaux éléments
          </h2>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

            {/* FORMATION */}
            <section className={sectionStyle}>
              <h3 className={sousTitre}>Créer une formation</h3>

              <form action={createFormation} className="space-y-6">
                <div>
                  <label htmlFor="nomFormation" className={labelStyle}>Nom</label>
                  <input
                    id="nomFormation"
                    name="nomFormation"
                    type="text"
                    placeholder="Nom de la formation"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="description" className={labelStyle}>Description</label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Description de la formation"
                    className={inputStyle}
                    rows={3}
                    required
                  />
                </div>

                <button type="submit" className={btnAjouter}>
                  Ajouter la formation
                </button>
              </form>
            </section>

            {/* COURS */}
            <section className={sectionStyle}>
              <h3 className={sousTitre}>Créer un cours</h3>

              <form action={createCours} className="space-y-6">
                <div>
                  <label htmlFor="titre" className={labelStyle}>Titre du cours</label>
                  <input
                    id="titre"
                    name="titre"
                    type="text"
                    placeholder="Titre du cours"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="formationId" className={labelStyle}>Formation associée</label>
                  <select id="formationId" name="formationId" className={inputStyle} required>
                    <option value="">Choisir une formation</option>
                    {formations.map((formation) => (
                      <option key={formation.id} value={formation.id}>
                        {formation.nom}
                      </option>
                    ))}
                  </select>
                </div>

                <button type="submit" className={btnAjouter}>
                  Ajouter le cours
                </button>
              </form>
            </section>

            {/* ETUDIANT */}
            <section className={sectionStyle}>
              <h3 className={sousTitre}>Inscrire un étudiant</h3>

              <form action={createEtudiant} className="space-y-6">
                <div>
                  <label htmlFor="nomEtudiant" className={labelStyle}>Nom</label>
                  <input
                    id="nomEtudiant"
                    name="nomEtudiant"
                    type="text"
                    placeholder="Nom de l'étudiant"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label htmlFor="formations" className={labelStyle}>Formations</label>
                  <select
                    id="formations"
                    name="formations"
                    multiple
                    className={inputStyle}
                    size={3}
                  >
                    {formations.map((formation) => (
                      <option key={formation.id} value={formation.id}>
                        {formation.nom}
                      </option>
                    ))}
                  </select>
                  <p className="mt-2 text-xs text-slate-400">
                    Maintenez Ctrl pour sélectionner plusieurs formations.
                  </p>
                </div>

                <button type="submit" className={btnAjouter}>
                  Ajouter l'étudiant
                </button>
              </form>
            </section>

            {/* PROFIL */}
            <section className={sectionStyle}>
              <h3 className={sousTitre}>Créer un profil étudiant</h3>

              <form action={createProfil} className="space-y-6">
                <div>
                  <label htmlFor="etudiantId" className={labelStyle}>Étudiant</label>
                  <select id="etudiantId" name="etudiantId" className={inputStyle} required>
                    <option value="">Choisir un étudiant</option>
                    {etudiants
                      .filter((etudiant) => !etudiant.profil)
                      .map((etudiant) => (
                        <option key={etudiant.id} value={etudiant.id}>
                          {etudiant.nom}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="bio" className={labelStyle}>Biographie</label>
                  <textarea
                    id="bio"
                    name="bio"
                    placeholder="Biographie de l'étudiant"
                    className={inputStyle}
                    rows={3}
                  />
                </div>

                <button type="submit" className={btnAjouter}>
                  Ajouter le profil
                </button>
              </form>
            </section>
          </div>
        </section>

        {/* FORMATIONS */}
        <section className="space-y-7">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              Formations enregistrées
            </h2>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {formations.length} formations
            </span>
          </div>

          {formations.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-slate-500">
              Aucune formation enregistrée.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {formations.map((formation) => {
                const updateFormationAction = updateFormation.bind(null, formation.id);
                const deleteFormationAction = deleteFormation.bind(null, formation.id);

                return (
                  <article key={formation.id} className="space-y-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

                    <div className="space-y-3 border-b border-slate-200 pb-6">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Formation
                      </p>
                      <h3 className="text-xl font-bold text-slate-800">
                        {formation.nom}
                      </h3>
                      <p className="text-sm leading-6 text-slate-500">
                        {formation.description}
                      </p>
                    </div>

                    <form action={updateFormationAction} className="space-y-5">
                      <h4 className="font-bold text-slate-800">Modifier la formation</h4>

                      <div>
                        <label className={labelStyle}>Nom</label>
                        <input
                          type="text"
                          name="nom"
                          defaultValue={formation.nom}
                          className={inputStyle}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelStyle}>Description</label>
                        <textarea
                          name="description"
                          defaultValue={formation.description ?? ""}
                          className={inputStyle}
                          required
                        />
                      </div>

                      <button type="submit" className={btnModifier}>
                        Modifier
                      </button>
                    </form>

                    <form action={deleteFormationAction}>
                      <button type="submit" className={btnSupprimer}>
                        Supprimer la formation
                      </button>
                    </form>

                    {/* COURS */}
                    <div className="space-y-4 border-t border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-800">
                        Cours associés
                        <span className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-xs text-blue-700">
                          {formation.cours.length}
                        </span>
                      </h4>

                      {formation.cours.length === 0 ? (
                        <p className="text-sm text-slate-400">Aucun cours.</p>
                      ) : (
                        <ul className="space-y-5">
                          {formation.cours.map((cours) => {
                            const updateCoursAction = updateCours.bind(null, cours.id);
                            const deleteCoursAction = deleteCours.bind(null, cours.id);

                            return (
                              <li key={cours.id} className="space-y-4 rounded-xl bg-slate-50 p-5">
                                <form action={updateCoursAction} className="space-y-4">
                                  <input
                                    type="text"
                                    name="titre"
                                    defaultValue={cours.titre}
                                    className={inputStyle}
                                    required
                                  />

                                  <select
                                    name="formationId"
                                    defaultValue={String(cours.formationId)}
                                    className={inputStyle}
                                    required
                                  >
                                    {formations.map((f) => (
                                      <option key={f.id} value={f.id}>
                                        {f.nom}
                                      </option>
                                    ))}
                                  </select>

                                  <button type="submit" className={btnModifier}>
                                    Modifier
                                  </button>
                                </form>

                                <form action={deleteCoursAction}>
                                  <button type="submit" className={btnSupprimer}>
                                    Supprimer
                                  </button>
                                </form>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    {/* ETUDIANTS INSCRITS */}
                    <div className="space-y-4 border-t border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-800">
                        Étudiants inscrits à cette formation
                      </h4>

                      {formation.etudiants.length === 0 ? (
                        <p className="text-sm text-slate-400">Aucun étudiant.</p>
                      ) : (
                        <ul className="space-y-3">
                          {formation.etudiants.map((etudiant) => (
                            <li key={etudiant.id} className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
                              {etudiant.nom}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* ETUDIANTS */}
        <section className="space-y-7">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <h2 className="text-2xl font-bold text-slate-800">
              Liste des étudiants
            </h2>
            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {etudiants.length} étudiants
            </span>
          </div>

          {etudiants.length === 0 ? (
            <p className="rounded-xl bg-white p-6 text-slate-500">
              Aucun étudiant.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {etudiants.map((etudiant) => {
                const updateEtudiantAction = updateEtudiant.bind(null, etudiant.id);
                const deleteEtudiantAction = deleteEtudiant.bind(null, etudiant.id);
                const updateProfilAction = updateProfil.bind(null, etudiant.id);
                const deleteProfilAction = deleteProfil.bind(null, etudiant.id);

                const formationsIds = etudiant.formations.map((f) => String(f.id));

                return (
                  <article key={etudiant.id} className="space-y-7 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

                    <div className="border-b border-slate-200 pb-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                        Étudiant
                      </p>
                      <h3 className="mt-2 text-xl font-bold text-slate-800">
                        {etudiant.nom}
                      </h3>
                    </div>

                    <form action={updateEtudiantAction} className="space-y-5">
                      <h4 className="font-bold text-slate-800">
                        Modifier les informations
                      </h4>

                      <div>
                        <label className={labelStyle}>Nom</label>
                        <input
                          type="text"
                          name="nom"
                          defaultValue={etudiant.nom}
                          className={inputStyle}
                          required
                        />
                      </div>

                      <div>
                        <label className={labelStyle}>Formations suivies</label>
                        <select
                          name="formations"
                          multiple
                          defaultValue={formationsIds}
                          className={inputStyle}
                          size={3}
                        >
                          {formations.map((formation) => (
                            <option key={formation.id} value={formation.id}>
                              {formation.nom}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button type="submit" className={btnModifier}>
                        Modifier l'étudiant
                      </button>
                    </form>

                    <form action={deleteEtudiantAction}>
                      <button type="submit" className={btnSupprimer}>
                        Supprimer l'étudiant
                      </button>
                    </form>

                    {/* PROFIL */}
                    <div className="space-y-5 border-t border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-800">
                        Profil de l'étudiant
                      </h4>

                      {etudiant.profil ? (
                        <div className="space-y-4">
                          <form action={updateProfilAction} className="space-y-4">
                            <textarea
                              name="bio"
                              defaultValue={etudiant.profil.bio ?? ""}
                              className={inputStyle}
                              rows={3}
                            />

                            <button type="submit" className={btnModifier}>
                              Modifier le profil
                            </button>
                          </form>

                          <form action={deleteProfilAction}>
                            <button type="submit" className={btnSupprimer}>
                              Supprimer le profil
                            </button>
                          </form>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-400">
                          Aucun profil enregistré.
                        </p>
                      )}
                    </div>

                    {/* FORMATIONS SUIVIES */}
                    <div className="space-y-4 border-t border-slate-200 pt-6">
                      <h4 className="font-bold text-slate-800">
                        Formations auxquelles l'étudiant est inscrit
                      </h4>

                      {etudiant.formations.length === 0 ? (
                        <p className="text-sm text-slate-400">
                          Aucune formation.
                        </p>
                      ) : (
                        <ul className="space-y-3">
                          {etudiant.formations.map((formation) => (
                            <li key={formation.id} className="rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-800">
                              {formation.nom}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-400">
          Gestion des formations
        </footer>

      </div>
    </main>
  );
}
