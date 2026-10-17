import { createElement, useState } from "react";
import {
  CalendarDays,
  Download,
  FileText,
  KeyRound,
  Moon,
  Pencil,
  ShieldCheck,
  Sun,
  UserRound,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import FormModal from "../components/UI/FormModal";
import Spinner from "../components/UI/Spinner";
import {
  changePassword,
  exportData,
  exportPdfReport,
  updatePreferences,
  updateProfile,
} from "../services/settingsService";

const themeOptions = [
  {
    value: "light",
    label: "Light",
    description: "A bright, clean interface with white surfaces.",
    Icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description: "A calm navy interface with slate surfaces and blue accents.",
    Icon: Moon,
  },
];

const sectionClass = "rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6";
const inputClass = "mt-1 w-full rounded-lg border border-border bg-input px-3 py-2.5 text-foreground placeholder:text-foreground-muted focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30";
const primaryButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60";
const secondaryButtonClass = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground-secondary transition hover:bg-surface-secondary";

const SettingsPage = () => {
  const { user, setUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [name, setName] = useState(user?.name || "");
  const [weekStartsOn, setWeekStartsOn] = useState(
    String(user?.preferences?.weekStartsOn ?? 0),
  );
  const [defaultPage, setDefaultPage] = useState(user?.preferences?.defaultPage || "dashboard");
  const [dateFormat, setDateFormat] = useState(user?.preferences?.dateFormat || "MM/DD/YYYY");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showWeekStartForm, setShowWeekStartForm] = useState(false);
  const [exporting, setExporting] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingTheme, setSavingTheme] = useState(false);
  const [savingWeekStart, setSavingWeekStart] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const closeProfileForm = () => {
    setShowProfileForm(false);
    setName(user?.name || "");
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setSavingProfile(true);

    try {
      const result = await updateProfile({ name: name.trim() });
      setUser(result.user);
      setName(result.user.name);
      setShowProfileForm(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.message || "Unable to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleThemeChange = async (nextTheme) => {
    if (nextTheme === theme) return;
    setSavingTheme(true);
    await setTheme(nextTheme);
    setSavingTheme(false);
  };

  const handleWeekStartSubmit = async (event) => {
    event.preventDefault();
    setSavingWeekStart(true);

    try {
      const result = await updatePreferences({
        weekStartsOn: Number(weekStartsOn), defaultPage, dateFormat,
      });
      setUser(result.user);
      setShowWeekStartForm(false);
      toast.success("Preferences saved");
    } catch (error) {
      toast.error(error.message || "Unable to save preferences");
    } finally {
      setSavingWeekStart(false);
    }
  };

  const handleExport = async (format) => {
    setExporting(format);
    try {
      if (format === "pdf") {
        await exportPdfReport();
        toast.success("Your PDF report is ready");
      } else {
        await exportData();
        toast.success("Your full data backup is ready");
      }
    } catch (error) {
      toast.error(error.message || "Unable to export your data");
    } finally {
      setExporting(false);
    }
  };

  const closePasswordForm = () => {
    setShowPasswordForm(false);
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New password and confirmation do not match");
      return;
    }

    setSavingPassword(true);
    try {
      await changePassword({
        currentPassword: passwords.currentPassword,
        newPassword: passwords.newPassword,
      });
      closePasswordForm();
      toast.success("Password changed successfully");
    } catch (error) {
      toast.error(error.message || "Unable to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const weekStartLabel = Number(user?.preferences?.weekStartsOn ?? 0) === 1
    ? "Monday"
    : "Sunday";
  const defaultPageLabel = { dashboard: "Dashboard", todos: "To-dos", habits: "Habits" }[
    user?.preferences?.defaultPage || "dashboard"
  ];
  const dateFormatLabel = user?.preferences?.dateFormat || "MM/DD/YYYY";

  return (
    <div className="mx-auto max-w-4xl space-y-6 text-foreground">
      <header>
        <h1 className="text-2xl font-bold sm:text-3xl">Settings</h1>
        <p className="mt-2 text-foreground-secondary">
          Manage your profile, security, and TaskFlow preferences.
        </p>
      </header>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-primary-soft p-2 text-primary"><UserRound size={20} /></span>
          <div>
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="text-sm text-foreground-secondary">Your account details and display name.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-secondary/50 p-4 sm:flex-row sm:items-center">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground" aria-hidden="true">
            {(user?.name || "U").trim().charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{user?.name || "TaskFlow user"}</p>
            <p className="truncate text-sm text-foreground-secondary">{user?.email || ""}</p>
          </div>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => {
              setName(user?.name || "");
              setShowProfileForm(true);
            }}
          >
            <Pencil size={16} />
            Edit profile
          </button>
        </div>
        <p className="mt-3 text-xs text-foreground-muted">
          Email changes are unavailable until the app supports verifying new addresses.
        </p>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-primary-soft p-2 text-primary"><CalendarDays size={20} /></span>
          <div>
            <h2 className="text-lg font-semibold">Preferences</h2>
            <p className="text-sm text-foreground-secondary">Choose your appearance, landing page, and date display.</p>
          </div>
        </div>

        <fieldset>
          <legend className="mb-3 text-sm font-medium">Appearance</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {themeOptions.map(({ value, label, description, Icon }) => {
              const selected = theme === value;
              return (
                <label
                  key={value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary ${selected ? "border-primary bg-surface-secondary" : "border-border hover:bg-surface-secondary"}`}
                >
                  <input
                    type="radio"
                    name="theme"
                    value={value}
                    checked={selected}
                    disabled={savingTheme}
                    onChange={() => handleThemeChange(value)}
                    className="sr-only"
                  />
                  <span className="mt-0.5 rounded-lg bg-surface-secondary p-2">
                    {createElement(Icon, { size: 20, "aria-hidden": true })}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="font-semibold">{label}</span>
                    <span className="mt-1 block text-sm text-foreground-secondary">{description}</span>
                  </span>
                </label>
              );
            })}
          </div>
          {savingTheme && <p className="mt-3 text-sm text-foreground-muted">Saving appearance preference…</p>}
        </fieldset>

        <div className="mt-6 flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="text-sm font-medium">Display preferences</p>
            <p className="mt-1 text-sm text-foreground-secondary">Home: {defaultPageLabel} · Dates: {dateFormatLabel} · Week: {weekStartLabel}</p>
          </div>
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={() => {
              setWeekStartsOn(String(user?.preferences?.weekStartsOn ?? 0));
              setDefaultPage(user?.preferences?.defaultPage || "dashboard");
              setDateFormat(user?.preferences?.dateFormat || "MM/DD/YYYY");
              setShowWeekStartForm(true);
            }}
          >
            Edit preferences
          </button>
        </div>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-primary-soft p-2 text-primary"><FileText size={20} /></span>
          <div>
            <h2 className="text-lg font-semibold">Take your data with you</h2>
            <p className="text-sm text-foreground-secondary">Save a clear, readable report of your TaskFlow activity.</p>
          </div>
        </div>
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-secondary/50 p-4 sm:flex-row sm:items-center">
          <div className="flex-1">
            <p className="font-medium">PDF report</p>
            <p className="mt-1 text-sm text-foreground-secondary">Easy to read, print, and share. Includes your profile summary, to-dos, notes, goals, and habit history.</p>
          </div>
          <button type="button" className={primaryButtonClass} onClick={() => handleExport("pdf")} disabled={Boolean(exporting)}>
            {exporting === "pdf" ? <Spinner size={16} label="Preparing PDF report" /> : <Download size={16} />}
            {exporting === "pdf" ? "Preparing PDF…" : "Download PDF report"}
          </button>
        </div>
        <details className="mt-4 rounded-xl border border-border bg-surface-secondary/40 p-4">
          <summary className="cursor-pointer font-medium text-foreground">Advanced backup options</summary>
          <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-center">
            <p className="flex-1 text-sm leading-6 text-foreground-secondary">
              Full backup (JSON). This file is for restoring or transferring your data with a compatible app. You do not need to open it to read your information; choose the PDF report for that.
            </p>
            <button type="button" className={secondaryButtonClass} onClick={() => handleExport("json")} disabled={Boolean(exporting)}>
              {exporting === "json" ? <Spinner size={16} label="Preparing full backup" /> : <Download size={16} />}
              {exporting === "json" ? "Preparing backup…" : "Download full backup"}
            </button>
          </div>
        </details>
      </section>

      <section className={sectionClass}>
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-primary-soft p-2 text-primary"><ShieldCheck size={20} /></span>
          <div>
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="text-sm text-foreground-secondary">Manage your account password.</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-xl border border-border bg-surface-secondary/50 p-4 sm:flex-row sm:items-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-secondary text-foreground-muted" aria-hidden="true">
            <KeyRound size={19} />
          </span>
          <div className="flex-1">
            <p className="font-medium">Password</p>
            <p className="mt-1 text-sm text-foreground-secondary">Change it any time using your current password.</p>
          </div>
          <button type="button" className={secondaryButtonClass} onClick={() => setShowPasswordForm(true)}>
            Change password
          </button>
        </div>
      </section>

      <FormModal
        isOpen={showProfileForm}
        onClose={closeProfileForm}
        title="Edit profile"
        subtitle="Choose the name shown in TaskFlow."
        loading={savingProfile}
      >
        <form className="space-y-5" onSubmit={handleProfileSubmit}>
          <label className="block text-sm font-medium">
            Display name
            <input
              className={inputClass}
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              maxLength={30}
              required
              autoComplete="name"
              autoFocus
            />
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" className={secondaryButtonClass} onClick={closeProfileForm} disabled={savingProfile}>
              Cancel
            </button>
            <button className={primaryButtonClass} type="submit" disabled={savingProfile}>
              {savingProfile && <Spinner size={16} label="Saving profile" />}
              {savingProfile ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={showWeekStartForm}
        onClose={() => setShowWeekStartForm(false)}
        title="Display preferences"
        subtitle="Choose where TaskFlow opens and how dates appear across the app."
        loading={savingWeekStart}
      >
        <form className="space-y-5" onSubmit={handleWeekStartSubmit}>
          <label className="block text-sm font-medium">
            First day of the week
            <select
              className={inputClass}
              value={weekStartsOn}
              onChange={(event) => setWeekStartsOn(event.target.value)}
            >
              <option value="0">Sunday</option>
              <option value="1">Monday</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Default page after sign in
            <select className={inputClass} value={defaultPage} onChange={(event) => setDefaultPage(event.target.value)}>
              <option value="dashboard">Dashboard</option>
              <option value="todos">To-dos</option>
              <option value="habits">Habits</option>
            </select>
          </label>
          <label className="block text-sm font-medium">
            Date format
            <select className={inputClass} value={dateFormat} onChange={(event) => setDateFormat(event.target.value)}>
              <option value="MM/DD/YYYY">MM/DD/YYYY (10/17/2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (17/10/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (2026-10-17)</option>
            </select>
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" className={secondaryButtonClass} onClick={() => setShowWeekStartForm(false)} disabled={savingWeekStart}>
              Cancel
            </button>
            <button className={primaryButtonClass} type="submit" disabled={savingWeekStart}>
              {savingWeekStart && <Spinner size={16} label="Saving preferences" />}
              {savingWeekStart ? "Saving…" : "Save preferences"}
            </button>
          </div>
        </form>
      </FormModal>

      <FormModal
        isOpen={showPasswordForm}
        onClose={closePasswordForm}
        title="Change password"
        subtitle="Use a strong password you have not used elsewhere."
        loading={savingPassword}
      >
        <form className="space-y-4" onSubmit={handlePasswordSubmit}>
          <label className="block text-sm font-medium">
            Current password
            <input
              className={inputClass}
              type="password"
              autoComplete="current-password"
              value={passwords.currentPassword}
              onChange={(event) => setPasswords((previous) => ({ ...previous, currentPassword: event.target.value }))}
              required
              autoFocus
            />
          </label>
          <label className="block text-sm font-medium">
            New password
            <input
              className={inputClass}
              type="password"
              autoComplete="new-password"
              value={passwords.newPassword}
              onChange={(event) => setPasswords((previous) => ({ ...previous, newPassword: event.target.value }))}
              minLength={6}
              required
            />
          </label>
          <label className="block text-sm font-medium">
            Confirm new password
            <input
              className={inputClass}
              type="password"
              autoComplete="new-password"
              value={passwords.confirmPassword}
              onChange={(event) => setPasswords((previous) => ({ ...previous, confirmPassword: event.target.value }))}
              minLength={6}
              required
            />
          </label>
          <p className="text-xs text-foreground-muted">
            Use at least 6 characters with an uppercase letter, a lowercase letter, and a number.
          </p>
          <div className="flex justify-end gap-3 pt-1">
            <button type="button" className={secondaryButtonClass} onClick={closePasswordForm} disabled={savingPassword}>
              Cancel
            </button>
            <button className={primaryButtonClass} type="submit" disabled={savingPassword}>
              {savingPassword && <Spinner size={16} label="Changing password" />}
              {savingPassword ? "Changing…" : "Update password"}
            </button>
          </div>
        </form>
      </FormModal>
    </div>
  );
};

export default SettingsPage;
