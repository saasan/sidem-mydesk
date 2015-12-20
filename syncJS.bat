@ECHO OFF
PUSHD %~dp0

robocopy js ..\githubPages\_source\sidem-mydesk\js * /MIR /XA:SH

POPD
PAUSE
